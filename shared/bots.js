/* Crawlers ask for pages constantly and would drown a view counter in traffic
   nobody read. The list is deliberately conservative: it matches agents that
   announce themselves, and never guesses about a browser it does not know. */

const BOT_PATTERN = /(bot|crawler|spider|crawling|slurp|facebookexternalhit|embedly|quora link preview|showyoubot|outbrain|pinterest|vkshare|w3c_validator|whatsapp|telegrambot|discordbot|skypeuripreview|applebot|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|perplexity|headlesschrome|phantomjs|lighthouse|pingdom|uptimerobot|curl\/|wget\/|python-requests|node-fetch|axios\/|go-http-client|java\/|okhttp)/i;

export function isLikelyBot(userAgent) {
    const value = String(userAgent || '');
    /* No user agent at all is either a script or a privacy tool; either way it
       is not a page view worth counting. */
    if (!value.trim()) return true;
    return BOT_PATTERN.test(value);
}
