const verifyLink = (url) => /^(https?:\/\/)[\da-z.-]+\.[a-z.]{2,6}([\/\w .-]*)*\/?$/i.test(url);

export default verifyLink;