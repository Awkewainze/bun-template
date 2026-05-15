import { If } from "./logic/If";
import { memo, type ReactNode } from "react";
import loading from "@/assets/loading.min.svg";


export const LoadingImage = memo(function () {
	return <div className="loading flex items-center max-w-fit max-h-fit"><img src={loading} /></div>
});

export const Loading = memo(function ({ isLoading, children }: { isLoading: boolean, children: ReactNode }) {
	return <If condition={isLoading} elseRender={children}>
		<LoadingImage />
	</If>
});
