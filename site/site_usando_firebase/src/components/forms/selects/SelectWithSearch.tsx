import styles from "./SelectWithSearch.module.css";
import { useState, useEffect } from "react";

interface SelectWithSearchProps {
  value: string;
  setValue(value: string): void;
  options: string[];
  labelText?: string;
  labelStyle?: any;
  labelColorWhenSelected?: string;
}

export default function SelectWithSearch(props: SelectWithSearchProps) {
  const [active, setActive] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [labelStyle, setLabelStyle] = useState<any>();

  useEffect(() => {
    if(props.value) {
      const {color, ...rest} = props.labelStyle;
      rest["color"] = props.labelColorWhenSelected;
      setLabelStyle(rest);
      return;
    }
    setLabelStyle(props.labelStyle);
  }, []);

  return (
    <div
      className={
        active
          ? `${styles.mainSelectBox} ${styles.active}`
          : styles.mainSelectBox
      }
    >
      {labelStyle && (
        <label style={labelStyle} htmlFor="soValue">
          {props.labelText}
        </label>
      )}
      <div className={styles.selectOption}>
        <input
          type="text"
          autoComplete="off"
          placeholder={"Nada selecionado"}
          onClick={() => {
            setActive(!active);
          }}
          value={props.value}
          required
          id="soValue"
          name=""
        />
      </div>
      <div className={styles.content}>
        <div className={styles.search}>
          <input
            type="text"
            name=""
            id="optionSearch"
            placeholder="Procurar"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <ul className={styles.options}>
          {props.options &&
            (search
              ? props.options.map((item) => {
                  if (item.toUpperCase().indexOf(search.toUpperCase()) > -1) {
                    return (
                      <li
                        onClick={() => {
                          const { color, ...rest } = labelStyle;
                          setLabelStyle({
                            ...rest,
                            color: props.labelColorWhenSelected,
                          });
                          props.setValue(item);
                        }}
                        key={item}
                      >
                        {item}
                      </li>
                    );
                  } else {
                    return;
                  }
                })
              : props.options.map((item) => (
                  <li
                    onClick={() => {
                      const { color, ...rest } = labelStyle;
                      setLabelStyle({
                        ...rest,
                        color: props.labelColorWhenSelected,
                      });
                      props.setValue(item);
                    }}
                    key={item}
                  >
                    {item}
                  </li>
                )))}
        </ul>
      </div>
    </div>
  );
}
