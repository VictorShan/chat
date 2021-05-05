import { useParams } from "react-router"


export default function ChatRoom() {
  // @ts-ignore
  let { room } = useParams()
  return (
    <>
      <h1>ChatRoom: {room}</h1>
    </>
  )
}