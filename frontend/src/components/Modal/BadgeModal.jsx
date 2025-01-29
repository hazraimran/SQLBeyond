import "../../styles/BadgeModal.css";
import closeBtn from "../../assets/closeBtn.svg";

const BadgeModal = ({ closeBadgeModal, badgeData }) => {
  return (
    <div className="badgeModal-container">
      <div className="badgeModal-container-2">
        <div className="badge-header">
          <div className="badge-close-btn" onClick={closeBadgeModal}>
            <img src={closeBtn} alt="close button" />
          </div>
        </div>
        <div className="badgeModal">
          <img src={badgeData.badge} alt={badgeData.name} />
          <h1>{badgeData.displayName}</h1>
          <p>{badgeData.criteria}</p>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;
