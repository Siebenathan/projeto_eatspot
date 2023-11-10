import styles from "./DropDown.module.css";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { useState } from "react";

interface DropDownProps {
  items: [];
  textDropDown: string;
  styleTextDropDown: any;
}

export default function DropDown(props: DropDownProps) {
  const [active, setActive] = useState<boolean>(false);

  return (
    <div></div>
  );
}
