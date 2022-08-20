export const ja = {
  auto: "自動",
  swing: "スイング",
  blow: "送風",
  cool: "冷房",
  dry: "ドライ",
  warm: "暖房",
};

export const t = (text: string) => {
  return ja[text as keyof typeof ja] || text;
};
