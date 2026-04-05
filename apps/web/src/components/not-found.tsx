import { Link } from "@tanstack/react-router"

export const NotFound = (props: { title: string }) => {
    return (
        <div>
            <div>{props.title} Not Found</div>
            <Link to="/">Go Home</Link>
        </div>

    )
}