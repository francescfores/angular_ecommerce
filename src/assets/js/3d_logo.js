window.onload = function(){
  const card = document.querySelector('.card');
  const card3d = document.querySelector('.card-3d');
  const stats = document.querySelector('.stats');

  const documentStyle = document.documentElement.style;

  const cardWidth = card.clientWidth;
  const cardHeight = card.clientHeight;

  const INTENSITY = 0.3;

  const throttle = (cb, delay) => {
    let shouldWait = false;
    let lastCallArgs;

    if (shouldWait) return;

    const timeoutCb = () => {
      if (lastCallArgs) {
        cb(lastCallArgs);
        lastCallArgs = null;
        setTimeout(timeoutCb, delay);
      } else {
        shouldWait = false
      }
    }

    return (...args) => {
      if (shouldWait) return;

      cb(...args);
      shouldWait = true;
      setTimeout(timeoutCb, delay);
    }
  }

  const updateMousePosition = throttle((e) => {
    const x = ((e.offsetX / cardWidth) - 0.5) * 90 * INTENSITY;
    const y = ((e.offsetY / cardHeight) - 0.5) * 90 * INTENSITY;

    const anime = card3d.animate([
      {transform: `rotateY(${-x}deg) rotateX(${y}deg)`}
    ], {
      duration: 200,
      easing: 'ease',
    });

    anime.onfinish = () => {
      documentStyle.setProperty('--x', -x + 'deg');
      documentStyle.setProperty('--y', y + 'deg');
    }
  }, 10);

  card.addEventListener('mousemove', (e) => {
    updateMousePosition(e);
  });

  card.addEventListener('mouseleave', () => {
    const anime = card3d.animate([
      {transform: 'rotateY(0deg) rotateX(0deg)'}
    ], {
      duration: 400,
      easing: 'ease',
    });

    anime.onfinish = () => {
      documentStyle.setProperty('--x', 0 + 'deg');
      documentStyle.setProperty('--y', 0 + 'deg');
    };
  })
}
