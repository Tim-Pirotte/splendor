function binarySearchObjects(list, target, attribute, start=0, end=list.length - 1) {
  if (start > end) return;

  const mid = Math.floor((start + end) / 2);
  if (list[mid][attribute] === target) return list[mid];

  if (list[mid][attribute] > target) binarySearchObjects(list, target, attribute, start, mid - 1);
  return binarySearchObjects(list, target, attribute, mid + 1, end);
}