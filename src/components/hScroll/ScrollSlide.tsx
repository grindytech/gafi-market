import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { LeftArrow, RightArrow } from "./Arrow";
// type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

export default function ScrollSlide({ children }: { children: any }) {
  // const onWheel = (apiObj: scrollVisibilityApiType, ev: React.WheelEvent) => {
  //   const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;
  //   if (isThouchpad) {
  //     ev.stopPropagation();
  //     return;
  //   }
  //   if (ev.deltaY < 0) {
  //     apiObj.scrollNext();
  //   } else if (ev.deltaY > 0) {
  //     apiObj.scrollPrev();
  //   }
  // };
  return (
    <ScrollMenu
      LeftArrow={LeftArrow}
      RightArrow={RightArrow}
      onWheel={() => {}}
    >
      {children}
    </ScrollMenu>
  );
}
