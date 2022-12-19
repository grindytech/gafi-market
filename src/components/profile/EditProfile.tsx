import { useSelector } from "react-redux"
import { selectProfile } from "../../store/profileSlice"

export default function EditProfile() { 
  const { user} = useSelector(selectProfile)
  return <></>
}