import React, { ReactChild, ReactChildren, useEffect, useRef, useState } from "react";
import { Link, canUseDOM } from "vtex.render-runtime";
import { createPortal } from "react-dom";

const phoneIcon = require("./icons/phone.svg") as string;
const textIcon = require("./icons/text.svg") as string;
const emailIcon = require("./icons/email.svg") as string;
const chatIcon = require("./icons/chat.svg") as string;
const brainTrustIcon = require("./icons/brain-trust.svg") as string;
const locationIcon = require("./icons/location.svg") as string;
const facebookIcon = require("./icons/facebook.svg") as string;
const instagramIcon = require("./icons/instagram.svg") as string;
const linkedinIcon = require("./icons/linkedin.svg") as string;
const youtubeIcon = require("./icons/youtube.svg") as string;
const carretIcon = require("./icons/carret.svg") as string;

// Styles
import styles from "./styles.css";

interface FooterMobileProps {
  children: ReactChildren | any
  menuTitles: Array<string>
}

interface MenuObject {
  title: string
  menu: ReactChild | any
}

const FooterMobile: StorefrontFunctionComponent<FooterMobileProps> = ({ menuTitles, children }) => {
  const openGate = useRef(true);
  const childRefs = useRef<any>([]);
  const modalRef = useRef<any>();
  const [showModal, setShowModal] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>();
  const [menuList, setMenuList] = useState<Array<MenuObject>>([]);
  const [activeMenuList, setActiveMenuList] = useState<Array<Boolean>>(menuTitles.map(() => false));
  const [activeMenuHeight, setActiveMenuHeight] = useState(0);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    copyrightYear();
    buildMenuList();
  });

  const buildMenuList = () => {
    const tempMenuList: Array<MenuObject> = [];

    for (let index = 0; index < children.length - 1; index++) {
      const tempMenuObject: MenuObject = {
        title: menuTitles[index],
        menu: children[index + 1] // The [0] child is the Newsletter App - LM
      }

      tempMenuList.push(tempMenuObject);
    }
    setMenuList(tempMenuList);
  }

  const copyrightYear = () => {
    const rightNow = new Date(Date.now());
    const thisYear = rightNow.getFullYear();

    setCurrentYear(thisYear);
  }

  // This is hacky, but the "Chat" component is third party
  // and this is a best case for the moment solution - LM
  const handleLiveChatClick = () => {
    if (!canUseDOM) return;

    const chatBubble: any = document.querySelector("#cloudlink-chat-overlay-contact-us-button");
    chatBubble?.classList.add(styles.wave);

    modalRef.current.showModal();
    setTimeout(() => { chatBubble?.classList.remove(styles.wave) }, 500);
  }

  const handleClickBackground = (e: any) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    const modalBounds = modalRef.current.getBoundingClientRect();

    if (clickX < modalBounds.left || clickX > modalBounds.right || clickY < modalBounds.top || clickY > modalBounds.bottom) {
      modalRef.current.close();
    }
  }

  const handleCloseModal = () => {
    modalRef.current.close();
  }

  const Modal = () => (
    <dialog ref={modalRef} className={styles.modalContainer} onClick={handleClickBackground} >
      <div className={styles.modalText}>
        Please use the Chat Bubble in the lower right corner of your screen.
      </div>
      <button aria-label="Close Dialog." onClick={handleCloseModal} className={styles.modalCloseButton} >Close</button>
    </dialog>
  );

  const setRef = (element: any, refList: any) => {
    // Conditional prevents filling refLists with null on unmount / remount - LM
    if (refList.length >= menuList.length) return;
    return refList.push(element);
  }

  const handleMenuClick = (e: any) => {
    const selectedMenuNumber = Number(e.currentTarget.dataset.menunumber);

    // If selected menu is already open this variable will be true - LM
    const menuCurrentlyActive = activeMenuList[selectedMenuNumber] === true;

    const wrapperElement = childRefs.current[selectedMenuNumber];
    const wrapperHeight = wrapperElement.offsetHeight;

    const tempActiveMenuData: Array<Boolean> = menuList.map(() => false);

    if (!menuCurrentlyActive) tempActiveMenuData[selectedMenuNumber] = true;

    setActiveMenuList(tempActiveMenuData);
    setActiveMenuHeight(wrapperHeight);
  }

  return (
    <footer className={styles.container}>
      <div className={styles.contactGroup}>
        <div className={styles.contactItem}>
          <a href="tel:9523519148" className={styles.contactLink}>
            <img src={phoneIcon} width={50} height={50} className={styles.icon} />
            <div className={styles.contactText}>
              <div className={styles.contactLabel}>
                Call Us
              </div>
              <div className={styles.contactInfo}>
                952-351-9148
              </div>
            </div>
          </a>
        </div>
        <div className={styles.contactItem}>
          <a href="sms:9522435476?&body=I have a question about " className={styles.contactLink}>
            <img src={textIcon} width={50} height={50} className={styles.icon} />
            <div className={styles.contactText}>
              <div className={styles.contactLabel}>
                Text Us
              </div>
              <div className={styles.contactInfo}>
                952-243-5476
              </div>
            </div>
          </a>
        </div>
        <div className={styles.contactItem}>
          <a href="mailto:help@eriksbikeshop.com" className={styles.contactLink}>
            <img src={emailIcon} width={50} height={50} className={styles.icon} />
            <div className={styles.contactText}>
              <div className={styles.contactLabel}>
                Email Us
              </div>
              <div className={styles.contactInfo}>
                help@eriksbikeshop.com
              </div>
            </div>
          </a>
        </div>
        <div className={styles.contactItem}>
          <button onClick={handleLiveChatClick} className={styles.contactButton}>
            <img src={chatIcon} width={50} height={50} className={styles.icon} />
            <div className={styles.contactText}>Live Chat</div>
          </button>
        </div>
      </div>
      <div className={styles.connectGroup}>
        <div className={styles.connectItem}>
          <div className={styles.itemTitle}>Help Center</div>
          <div className={styles.itemDescription}>Let our Experts answer all your questions.</div>
          <div className={styles.iconRow}>
            <Link href="/customer-service" className={styles.contactLink}>
              <img src={brainTrustIcon} width={75} height={50} className={styles.icon} />
              <div className={styles.iconLabel}>Brain Trust</div>
            </Link>
          </div>
        </div>
        <div className={styles.connectItem}>
          <div className={styles.itemTitle}>Store Locator</div>
          <div className={styles.itemDescription}>Grab your gear today.</div>
          <Link href="/stores" className={styles.storeLink}>
            <img src={locationIcon} width={50} height={50} className={styles.icon} />
            <div className={styles.buttonLabel}>Find a Store</div>
          </Link>
        </div>
        <div className={styles.connectItem}>
          <div className={styles.itemTitle}>Connect Socially</div>
          <div className={styles.itemDescription}>See what we're up to.</div>
          <div className={styles.itemRow}>
            <Link href="https://www.facebook.com/eriksbikeshop/" rel="noreferrer" target="_blank" alt="Facebook Icon." className={styles.socialLink}>
              <img src={facebookIcon} width={50} height={50} className={styles.icon} />
            </Link>
            <Link href="https://www.instagram.com/eriksbikeboardski/" rel="noreferrer" target="_blank" alt="Instagram Icon." className={styles.socialLink}>
              <img src={instagramIcon} width={50} height={50} className={styles.icon} />
            </Link>
            <Link href="https://www.linkedin.com/company/erik's-bike-shops/" rel="noreferrer" target="_blank" alt="LinkedIn Icon." className={styles.socialLink}>
              <img src={linkedinIcon} width={50} height={50} className={styles.icon} />
            </Link>
            <Link href="https://www.youtube.com/@EriksBikeandBoardShop" rel="noreferrer" target="_blank" alt="Youtube Icon." className={styles.socialLink}>
              <img src={youtubeIcon} width={50} height={50} className={styles.icon} />
            </Link>
          </div>
        </div>
        <div className={styles.connectItem}>
          <div className={styles.itemTitle}>Email Sign Up</div>
          <div className={styles.itemDescription}>Love Gear? Sweet! Join Our Email List!</div>
          {/* Klaviyo script adds their newsletter signup to this <div> */}
          <div className="klaviyo-form-UMKxiH eriksbikeshop-footermobile-1-x-klaviyo" />
        </div>
      </div>
      <div className={styles.menuRow}>
        {menuList.map((menu, index) => (
          <div key={menu.title} data-activemenu={activeMenuList[index] ? "true" : "false"} className={styles.menuContainer}>
            <button onClick={handleMenuClick} data-menunumber={index} aria-expanded={activeMenuList[index] ? "true" : "false"} aria-controls={`window-${index}`} className={styles.menuButton}>
              <div className={styles.menuButtonText}>{menu.title}</div>
              <img src={carretIcon} alt="" width={50} height={50} className={styles.icon} />
            </button>
            <div id={`window-${index}`} style={{ height: activeMenuList[index] ? `${activeMenuHeight}px` : "0px" }} aria-hidden={activeMenuList[index] ? "false" : "true"} className={styles.menuWindow}>
              <div ref={(element: any) => setRef(element, childRefs.current)} className={styles.menuWrapper}>
                {menu.menu}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.copyrightRow}>
        <div className={styles.copyrightText}>© {currentYear} ERIK'S Bike Shop Inc. All Rights Reserved.<br></br>
          <Link href="/privacy" className={styles.copyrightLink}>Privacy Policy</Link>
        </div>
      </div>
      {canUseDOM && createPortal(<Modal />, document.body)}
    </footer>
  );
};

FooterMobile.schema = {
  title: "FooterMobile",
  description: "",
  type: "object",
  properties: {

  }
};

export default FooterMobile;

