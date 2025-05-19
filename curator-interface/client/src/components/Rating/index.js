import { useGlobalState } from "../../hooks/globalState";
import Language from "../../helpers/languagesConfig";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import {
  FaceDissatisfied,
  FaceNeutral,
  FaceSatisfied,
  FaceActivated,
  FaceCool,
} from "@carbon/icons-react";
import Rating from "@mui/material/Rating";
import { createRows } from "../../helpers/misc";

export default function BasicRating({ intent, logID, defaultValue }) {
  const { logs, setLogs } = useGlobalState();
  const { language } = useParams();

  const customIcons = {
    1: {
      icon: <FaceDissatisfied size={24} />,
      label: Language[language].rating.lbl1,
    },
    2: {
      icon: <FaceNeutral size={24} />,
      label: Language[language].rating.lbl2,
    },
    3: {
      icon: <FaceSatisfied size={24} />,
      label: Language[language].rating.lbl3,
    },
    4: {
      icon: <FaceActivated size={24} />,
      label: Language[language].rating.lbl4,
    },
    5: {
      icon: <FaceCool size={24} />,
      label: Language[language].rating.lbl5,
    },
  };

  function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };

  function updateScore(newValue) {
    logs[intent].map((log) => {
      if (log.LOGID === logID) {
        log.SCORE = newValue;
        setLogs(logs);
      }
    });
  }

  return (
    <Rating
      name="highlight-selected-only"
      defaultValue={defaultValue}
      IconContainerComponent={IconContainer}
      highlightSelectedOnly
      sx={{
        "& .MuiRating-iconFilled": {
          color: "#0E61FE",
        },
        "& .MuiRating-iconEmpty": {
          color: "#b5b5b5",
        },
      }}
      onChange={(e, newValue) => {
        updateScore(newValue);
      }}
    />
  );
}
