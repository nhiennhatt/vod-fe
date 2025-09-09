
import { NewestVideos } from "./NewestVideos";

export function HomePage() {

    const video = {
        id: "1",
        title: "Video ABC",
        description: "Video ABC",
        thumbnail: "https://images.pexels.com/photos/13397143/pexels-photo-13397143.jpeg",
        videoUrl: "https://images.pexels.com/photos/13397143/pexels-photo-13397143.jpeg",
        user: {
            username: "john.doe",
            firstName: "John",
            lastName: "Doe",
        },
        createdOn: new Date(),
    }

    return (
        <div className="max-w-6xl mx-auto px-2.5 my-5">
            <NewestVideos />
        </div>
    )
}