import { redirect } from "@sveltejs/kit";

const allowablePlayModes = ["daily", "practice", "infinite"];
const allowableColorModes = ["rgb", "cmyk"];

export async function load({ params }) {
  const { playMode, colorMode } = params;

  // Validate playMode and colorMode
  if (!allowablePlayModes.includes(playMode) || !allowableColorModes.includes(colorMode)) {
    redirect(308, "/huehunter/daily-rgb");
  }

  return {
    props: {
      playMode,
      colorMode,
    },
  };
}
