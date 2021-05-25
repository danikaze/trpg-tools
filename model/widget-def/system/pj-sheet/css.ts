import { cssHeader } from '../../constants';

export const css = `${cssHeader}

.container {
  display: flex;
  flex-direction: column;
}

.sheet {
  width: 740px;
  height: 514px;
  position: relative;
  background-image: url(#Character sheet BG#);
}

.image {
  position: absolute;
  top: 110px;
  left: 40px;
  width: 300px;
  height: 370px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.name {
  top: 35px;
  left: 50px;
  position: absolute;
  font-size: 35px;
  font-weight: bold;
}

.levelRaceClass {
  top: 70px;
  left: 50px;
  position: absolute;
  font-size: 24px;
}

.hpBar {
  top: 100px;
  left: 360px;
  width: 200px !important;
  position: absolute;
  font-size: 24px;
  text-align: right;
  font-weight: bold;
}
.hpBar-text {
  margin-bottom: 5px;
}
.hpBar-bg {
  width: 100%;
    height: 15px;
    display: flex;
    position: relative;
    background: linear-gradient(
      rgb(208, 208, 208) 8%,
      rgb(156, 156, 156) 4%,
      rgb(175, 175, 175) 36%,
      rgb(78, 78, 78) 100%
    );
}
.hpBar-segment {
  height: 100%;
  display: inline-block;
  transition: width 2000ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.hpBar-current {
  background: linear-gradient(
    180deg,
    rgb(12 228 15) 8%,
    rgba(14,170,15,1) 4%,
    rgba(25,193,27,1) 36%,
    rgb(6 117 0) 100%
  );
}
.hpBar-temp {
  background: linear-gradient(
    180deg,
    rgb(170 212 255) 8%,
    rgb(80 128 218) 4%,
    rgb(111 178 247) 36%,
    rgb(0 83 142) 100%
  );
}

.ac {
  top: 60px;
  right: 67px;
  width: 77px;
  height: 88px;
  display: flex;
  position: absolute;
  font-size: 12px;
  align-items: center;
  font-weight: bold;
  background-size: contain;
  justify-content: center;
  background-image: url(#Armor Class BG#);
  background-repeat: no-repeat;
  background-position: center;
}
.ac-value {
  top: 20px;
  position: absolute;
  font-size: 28px;
}
.ac-text {
  top: 58px;
  position: absolute;
}

.stats {
  right: 40px;
  width: 340px;
  bottom: 40px;
  height: 280px;
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: space-evenly;
}
.stats-group {
  display: flex;
  margin-top: 10px;
  margin-right: 10px;
  justify-content: space-between;
}

.stat-one {
  width: 102px;
  height: 120px;
  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 16px;
  flex-direction: column;
  padding-bottom: 12px;
  background-size: cover;
  background-image: url(#Stat value BG#);
}
.stat-name {
  top: 10px;
  position: absolute;
  font-size: 12px;
  font-weight: bold;
}
.stat-mod {
  top: 35px;
  position: absolute;
  font-size: 30px;
  font-weight: bold;
}
.stat-value {
  bottom: 14px;
  position: absolute;
  font-size: 16px;
  font-weight: bold;
}
`;
