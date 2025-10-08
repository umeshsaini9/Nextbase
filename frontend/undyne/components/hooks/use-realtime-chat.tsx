'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import {
  RealtimeChannel,
  REALTIME_SUBSCRIBE_STATES,
} from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

interface UseRealtimeChatProps {
  roomName: string
  username: string
}

export interface ChatMessage {
  id: string
  content: string
  user: {
    name: string
  }
  createdAt: string
}

const EVENT_MESSAGE_TYPE = 'message'

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newChannel = supabase.channel(roomName)

    newChannel
      .on(
        'broadcast',
        { event: EVENT_MESSAGE_TYPE },
        (payload: { event: string; payload: ChatMessage }) => {
          setMessages((current) => [...current, payload.payload])
        }
      )
      .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        }
        if (err) {
          console.error('Subscription error:', err)
        }
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [roomName, username])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return

      const message: ChatMessage = {
        id: uuidv4(),
        content,
        user: {
          name: username,
        },
        createdAt: new Date().toISOString(),
      }

      // Update local state immediately for sender
      setMessages((current) => [...current, message])

      await channel.send({
        type: 'broadcast',
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      })
    },
    [channel, isConnected, username]
  )

  return { messages, sendMessage, isConnected }
}
