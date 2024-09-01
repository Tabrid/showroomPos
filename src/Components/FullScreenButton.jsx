
import { BsArrowsFullscreen } from 'react-icons/bs';

function FullScreenButton() {
  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
          /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  return (
    <div>
      <button>
        
      </button>
      <button
        type="button"
        onClick={() => {
          toggleFullscreen();
        }}
        className="header-item noti-icon waves-effect text-white"
        data-toggle="fullscreen"
      >
        <BsArrowsFullscreen className="text-4xl  text-white" />
      </button></div>
  )
}

export default FullScreenButton