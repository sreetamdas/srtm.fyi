/**
 * The front door. Browsers are redirected to sreetamdas.com, as the `/*`
 * fallback in _redirects did before this Function took over `/` (redirects
 * are not applied to paths a Function serves). Terminal clients (curl, Wget,
 * HTTPie, xh, or an Accept of text/plain) get a text card instead; an Accept
 * that names text/html always gets the redirect.
 *
 * The last line of the card is a clue for the scavenger hunt on
 * sreetamdas.com. Its address is duplicated from that repo's
 * src/lib/domains/foobar/codes.ts (`curl`); change both together.
 */
const SITE = "https://sreetamdas.com/";
const TERMINAL_AGENT = /^(curl|wget|httpie|xh)\//i;

const BOLD = "\u001B[1m";
const DIM = "\u001B[2m";
const YELLOW = "\u001B[33m";
const RESET = "\u001B[0m";

const LINKS = [
	["web", "https://sreetamdas.com"],
	["blog", "https://sreetamdas.com/blog"],
	["github", "https://srtm.fyi/gh"],
	["x", "https://srtm.fyi/x"],
	["bluesky", "https://srtm.fyi/bsky"],
];

function renderCard(color) {
	const paint = (code, text) => (color ? `${code}${text}${RESET}` : text);

	return [
		"",
		`  ${paint(BOLD, "Sreetam Das")}`,
		`  ${paint(DIM, "Frontend Engineer @ Remote")}`,
		"",
		...LINKS.map(([label, url]) => `  ${paint(DIM, label.padEnd(8))} ${url}`),
		"",
		"  You came without a browser. Good.",
		"  There is a page for people like you:",
		`  ${paint(YELLOW, "https://sreetamdas.com/foobar/command-performance")}`,
		"",
		"",
	].join("\n");
}

export function onRequestGet({ request }) {
	const accept = (request.headers.get("Accept") ?? "").toLowerCase();
	const terminalAgent = TERMINAL_AGENT.test(request.headers.get("User-Agent") ?? "");
	const wantsText = !accept.includes("text/html") && (terminalAgent || accept.includes("text/plain"));

	if (!wantsText) {
		return new Response(null, {
			status: 302,
			headers: { Location: SITE, Vary: "User-Agent, Accept" },
		});
	}

	return new Response(renderCard(terminalAgent), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "no-store",
			Vary: "User-Agent, Accept",
		},
	});
}
