import {
  Analytics,
  WatsonHealthMagnify,
  Dashboard,
  UserAdmin,
} from "@carbon/icons-react";

import "./style.scss";
import { useNavigate, useParams } from "react-router-dom";
import { SideNav, SideNavItems, SideNavLink } from "@carbon/react";
import languagesConfig from "../../helpers/languagesConfig";

export default function SideMenu({ open }) {
  const navigate = useNavigate();
  const { language } = useParams();

  return (
    <SideNav expanded={open} isRail aria-label="side-navigation">
      <SideNavItems>
        <SideNavLink
          renderIcon={Dashboard}
          onClick={() => navigate(`/${language}/train`)}
        >
          {languagesConfig[language].sideNav.link1}
        </SideNavLink>
        <SideNavLink
          renderIcon={WatsonHealthMagnify}
          onClick={() => navigate(`/${language}/intents`)}
        >
          {languagesConfig[language].sideNav.link2}
        </SideNavLink>
      </SideNavItems>
    </SideNav>
  );
}
