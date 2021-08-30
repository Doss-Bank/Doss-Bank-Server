export default (): string => {
  const uuid: string = '002-xxxx-xxxx-xx'.replace(/x/g, (c) => {
    // 002는 Doss-Bank 고유 번호임
    const r = (Math.random() * 10) | 0;
    const v = c === 'x' ? r : (r & 3) | 8;
    return v.toString();
  });

  return uuid;
};
