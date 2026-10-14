export const COFFEE_FPS = 30;
export const COFFEE_SCENE_FRAMES = 270;
export const coffeeScenes = [
  {title: 'A better morning.', kicker: 'THE FRENCH PRESS', detail: 'Fresh beans. Hot water. A little patience.', tip: 'A practical starting recipe, brought to life.', metric: '30 g coffee / 500 g water'},
  {title: 'Grind fresh.', kicker: '01 / COARSE GRIND', detail: 'Measure 30 g of beans. Use a coarse, even grind.', tip: 'A burr grinder helps keep particle size consistent.', metric: '30 g / coarse'},
  {title: 'Heat the water.', kicker: '02 / HOT, NOT RUSHED', detail: 'Heat 500 g of water. Let it cool to about 93–96°C.', tip: 'Bring water to a boil, then allow it to cool before pouring.', metric: '500 g / 93–96°C'},
  {title: 'Add the grounds.', kicker: '03 / PREPARE THE PRESS', detail: 'Place your freshly ground coffee in the empty press.', tip: 'This stainless press is shown in cutaway so you can see inside.', metric: '30 g into the press'},
  {title: 'Pour slowly.', kicker: '04 / SATURATE EVENLY', detail: 'Add the hot water and gently stir to wet all the grounds.', tip: 'Keep the press on a stable surface. Take care with hot water.', metric: '500 g water'},
  {title: 'Give it time.', kicker: '05 / STEEP', detail: 'Set the lid on top with the plunger raised. Steep for about four minutes.', tip: 'Time is compressed here. Adjust the recipe to your taste.', metric: '4 minutes'},
  {title: 'Press gently.', kicker: '06 / SLOW AND STEADY', detail: 'Lower the plunger slowly. If it resists, stop rather than forcing it.', tip: 'The filter separates the grounds from the brewed coffee.', metric: 'Slow, even pressure'},
  {title: 'Pour. Enjoy.', kicker: '07 / SERVE', detail: 'Pour into your cup and decant the remaining coffee.', tip: 'Decanting helps avoid continued extraction in the press.', metric: 'Your next good morning'},
] as const;
export const COFFEE_DURATION = coffeeScenes.length * COFFEE_SCENE_FRAMES;
