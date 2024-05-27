'use client';
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
const VideoCall = dynamic(
   () => import("@/components/meet/VideCall"),
   { ssr: false }
)



export default function MeetHost() {

   const router = useRouter()
   const [ready, setReady] = useState(false)

   useEffect(() => {
      if (!router.isReady) return;
      setReady(true)
   }, [router.isReady]);

   return (
      ready ?
         <>
            <VideoCall />
         </>
         : <></>
   )
}