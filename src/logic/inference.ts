export function entropy(group: any[]): number {
  const total = group.length;
  if (total === 0) return 0;
  const p = 1 / total;
  return -total * p * Math.log2(p);
}

export function infoGain(candidates: any[], key: string): number {
  const totalEntropy = entropy(candidates);
  const yesGroup = candidates.filter(p => p[key] === true);
  const noGroup = candidates.filter(p => p[key] === false);

  const weighted =
    (yesGroup.length / candidates.length) * entropy(yesGroup) +
    (noGroup.length / candidates.length) * entropy(noGroup);

  return totalEntropy - weighted;
}

export function getBestQuestion(candidates: any[], questions: any[]): any {
  let maxGain = -Infinity;
  let best = questions[0];

  for (const q of questions) {
    const gain = infoGain(candidates, q.key);
    if (gain > maxGain) {
      maxGain = gain;
      best = q;
    }
  }

  return best;
}