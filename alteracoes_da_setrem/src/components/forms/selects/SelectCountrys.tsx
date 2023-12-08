import { useState } from "react";
import styles from "./SelectCountry.module.css";
import { FcGlobe } from "react-icons/fc";

interface SelectProps {
  name: string;
  labelText: string;
  optionsList: any[];
  setSelectedValue(nation: string): void;
  selectedValue: string;
  styleLabel?: {};
  values?: [];
  labelStyle?: {};
}

export default function SelectCountrys(props: SelectProps) {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  return (
    <>
      <div className={styles.selectBox}>
        <label style={props.labelStyle} htmlFor={props.name}>
          {props.labelText} <FcGlobe className={styles.earthIcon} />
        </label>
        <div
          onClick={() => setShowDropDown(!showDropDown)}
          id={props.name}
          className={styles.selected}
        >
          {props.selectedValue}
        </div>
        <div
          className={`${styles.optionsContainer} ${
            showDropDown ? styles.active : ""
          }`}
        >
          {props.optionsList.map((item) => (
            <div
              onClick={() => props.setSelectedValue(item.name.common)}
              className={styles.options}
              key={item.name.common}
            >
              <input
                type="radio"
                className={styles.radio}
                id={item.name.common}
                name={props.name}
              />
              <label htmlFor={item.name.commom}>{item.name.common}</label>
              <img src={item.flags.png} alt="flag" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
