import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./style/style.module.css";
import Image from "next/image";
const Nav = () => {
  const [modal, setModal] = useState(false);

  return (
    <>
      <div
        className={styles.modal}
        style={{ display: modal ? "block" : "none" }}
      >
        <div className={styles.iconXBox}>
          <Image
            src={"/assets/img/icon/x-icon1.png"}
            alt=""
            width={30}
            height={30}
            className={styles.iconX}
            onClick={() => {
              setModal(false);
            }}
          />
        </div>

        <div className={styles.modalNav}>
          <ul>
            <li>
              <Link href={"/"}>MY PAGE</Link>
            </li>
            <li>
              <Link href={"/"}>PROJECT</Link>
            </li>
            <li>
              <Link href={"/"}>STUDY</Link>
            </li>
            <li>
              <Link href={"/"}>WORK</Link>
            </li>
            <li>
              <Link href={"/"}>LOGOUT</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.navContainer}>
        <div className={styles.navWrap}>
          <div className={styles.navMenu}>
            <Link href={"/"}>
              <h1 className={styles.navTitle}>Study-cafe</h1>
            </Link>
            <ul className={styles.navLi}>
              <li>
                <Link href={"/Study"}>Study</Link>
              </li>
              <li>
                <Link href={"/Project"}>Project</Link>
              </li>
              <li>
                <Link href={"/"}>Work</Link>
              </li>
            </ul>
          </div>
          <div className={styles.mainNav}>
            <div className={styles.navUserMenu}>
              <Link href={"/Mypage"}>My page</Link>
              <Link href={"/Login"}>Logout</Link>
            </div>
            {/* <div className={styles.navUserMenu}>
          <Link href={"/Login"}>Login</Link>
        </div> */}
          </div>

          <div className={styles.mobileNav}>
            <Image
              src={"/assets/img/icon/menu.png"}
              alt=""
              width={40}
              height={25}
              onClick={() => {
                setModal(true);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
