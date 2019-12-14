import he from 'he';

export default rawHtml => {
    const normalizedText = rawHtml.replace(/<[^>]+>/g, '');
    const decodedText = he.decode(normalizedText);

    return decodedText;
};
