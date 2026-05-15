import { UserContext } from "@/contexts";
import { useCurrentUser } from "@/hooks";
import { memo, useContext } from "react";
import { Link } from "react-router";
import { If } from "./logic";

export const UserInfo = memo(function () {
	const currentUser = useCurrentUser();
	const user = useContext(UserContext);

	return <If condition={currentUser != null}>
		<div className="justify-center-down">
			<div>Hello {currentUser!.name}!</div>
			<div>{currentUser!.username}</div>
			<Link to="/auth/logout">Log out</Link>
		</div>
	</If>
});
