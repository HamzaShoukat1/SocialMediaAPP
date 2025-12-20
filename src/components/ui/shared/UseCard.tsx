import {type  Models } from "appwrite"
import { Link } from "react-router-dom"
import { Button } from "../button"
// import {type  PostDocument } from "../forms/Postform"

export type userDocument = Models.Document & {
    name:string
    username?:string
    imageUrl:string,

}

type userCardProps = {
    user:userDocument
}

export default function UseCard({ user }: userCardProps) {
  return (
    <Link
      to={`/profile/${user.$id}`}
      className="flex items-center justify-between w-full p-4  rounded-xl bg-dark-2 hover:bg-dark-3 transition"
    >
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className="w-14 h-14 rounded-full object-cover"
        />

        <div className="flex flex-col min-w-0">
          <p className="base-medium text-light-1 truncate">
            {user.name}
          </p>
          {user.username && (
            <p className="text-xs text-gray-400 truncate">
              @{user.username}
            </p>
          )}
        </div>
      </div>



      {/* Right: Button */}
      <Button
        type="button"
        size="sm"
        className="shad-button_primary px-5 shrink-0"
      >
        Follow
      </Button>
    </Link>
  )
}
