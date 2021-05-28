export const html = `
<div class="container">
  <div class="sheet" data-bg-img="Character sheet BG">
    <div class="name" data-note="title"></div>
    <div class="levelRaceClass">
      Level <span data-field="level"></span>
      <span data-field="class"></span>
    </div>
    <div class="image" data-field-bg-image="image"></div>
    <div class="hpBar">
      <div class="hpBar-text">
        <span data-field="hp"></span>
        /
        <span data-field="hpMax"></span>
        <span data-field="hpTemp"></span>
      </div>
      <div class="hpBar-bg">
        <div
          class="hpBar-segment hpBar-current"
          id="hpBarCurrent"
        ></div>
        <div
          class="hpBar-segment hpBar-temp"
          id="hpBarTemp"
        ></div>
      </div>
    </div>
    <div class="ac" data-bg-img="Armor Class BG">
      <div class="ac-value" data-field="ac"></div>
      <div class="ac-text">AC</div>
    </div>
    <div class="stats">
      <div class="stats-group">
        <div class="stat-one" data-bg-img="Stat value BG">
          <div class="stat-name">STR</div>
          <div class="stat-mod" data-field="strMod"></div>
          <div class="stat-value" data-field="str"></div>
        </div>
        <div class="stat-one" data-bg-img="Stat value BG">
          <div class="stat-name">DEX</div>
          <div class="stat-mod" data-field="dexMod"></div>
          <div class="stat-value" data-field="dex"></div>
        </div>
        <div class="stat-one" data-bg-img="Stat value BG">
          <div class="stat-name">CON</div>
          <div class="stat-mod" data-field="conMod"></div>
          <div class="stat-value" data-field="con"></div>
        </div>
      </div>
      <div class="stats-group">
        <div class="stat-one" data-bg-img="Stat value BG">
          <div class="stat-name">INT</div>
          <div class="stat-mod" data-field="intMod"></div>
          <div class="stat-value" data-field="int"></div>
        </div>
        <div class="stat-one" data-bg-img="Stat value BG">
          <div class="stat-name">WIS</div>
          <div class="stat-mod" data-field="wisMod"></div>
          <div class="stat-value" data-field="wis"></div>
        </div>
        <div class="stat-one" data-bg-img="Stat value BG">
          <div class="stat-name">CHA</div>
          <div class="stat-mod" data-field="chaMod"></div>
          <div class="stat-value" data-field="cha"></div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
