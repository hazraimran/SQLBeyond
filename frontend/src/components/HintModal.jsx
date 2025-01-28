import "../styles/HintModal.css";
import closeBtn from "../assets/closeBtn.svg";

const HintModal = ({ closeHintModal, hintData }) => {
    return (
        <div className="hintModal-container">
            <div className="hintModal-container-2">
                <div className="hint-header">
                    <div className="hint-close-btn" onClick={closeHintModal}>
                        <img src={closeBtn} alt="close button" />
                    </div>
                </div>
                <div className="hintModal">
                    
                </div>
            </div>
        </div>
    )
}

export default HintModal;