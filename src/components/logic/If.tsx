import { memo, type ReactNode } from "react"

export type SharedProps = { condition: boolean, children: ReactNode };
export type RenderProps = { hideMethod?: "render", elseRender?: ReactNode } & SharedProps;
export type DisplayOrVisibilityProps = { hideMethod: "display" | "visibility" } & SharedProps;
export type IfProps = RenderProps | DisplayOrVisibilityProps;

export const If = memo(function (props: IfProps): ReactNode {
	const { condition, hideMethod = "render", children } = props;

	if (hideMethod === "render") {
		return condition ? children : (props as RenderProps).elseRender;
	}

	if (hideMethod === "display") {
		// using `display: none;`
		return <span className={condition ? "" : "hidden"}>
			{children}
		</span>
	}

	if (hideMethod === "visibility") {
		// using `visibility: hidden;`
		return <span className={condition ? "" : "invisible"}>
			{children}
		</span>
	}

	return children;
});
