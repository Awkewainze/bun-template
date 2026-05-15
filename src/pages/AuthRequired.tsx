import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { If } from "@/components";
import { useCurrentUser, useIsLoggedIn } from "@/hooks";
import { UserContext } from "@/contexts";

export function AuthRequired() {
	const isLoggedIn = useIsLoggedIn();
	const currentUser = useCurrentUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/auth/login");
		}
	}, [isLoggedIn]);

	return <If condition={isLoggedIn}>
		<UserContext value={""}>
			<Outlet />
		</UserContext>
	</If>;
}
