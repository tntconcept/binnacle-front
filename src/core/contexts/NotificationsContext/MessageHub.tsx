import React from "react";
import { useEffect, useState } from "react";
import NotificationStyles from "core/contexts/NotificationsContext/notificationStyles";
import { useTransition } from "react-spring";

let id = 0;

const MessageHub: React.FC<any> = ({
  config = { tension: 125, friction: 20, precision: 0.1 },
  timeout = 3000,
  children
}) => {
  const [refMap] = useState(() => new WeakMap());
  const [cancelMap] = useState(() => new WeakMap());
  const [items, setItems] = useState([]);
  const transitions = useTransition(items, (item: any) => item.key, {
    from: { opacity: 0, height: 0, life: "100%" },
    enter: item => async next =>
      await next({ opacity: 1, height: refMap.get(item).offsetHeight }),
    leave: item => async (next, cancel) => {
      cancelMap.set(item, cancel);
      await next({ life: "0%" });
      await next({ opacity: 0 });
      await next({ height: 0 });
    },
    onRest: item =>
      setItems(state => state.filter((i: any) => i.key !== item.key)),
    config: (item, state) =>
      state === "leave" ? [{ duration: timeout }, config, config] : config
  });

  // @ts-ignore
  useEffect(
    () =>
      void children((msg: any) =>
        setItems((state: never[]) => [...state, { key: id++, msg }])
      ),
    [children]
  );
  return (
    <NotificationStyles.Container>
      {transitions.map(({ key, item, props: { life, ...style } }) => (
        <NotificationStyles.Message
          key={key}
          style={style}>
          <NotificationStyles.Content ref={ref => ref && refMap.set(item, ref)}>
            <p>{item.msg}</p>
            <button
              onClick={e => {
                e.stopPropagation();
                cancelMap.has(item) && cancelMap.get(item)();
              }}
            >
              <span>x</span>
            </button>
          </NotificationStyles.Content>
        </NotificationStyles.Message>
      ))}
    </NotificationStyles.Container>
  );
};

export default MessageHub;
