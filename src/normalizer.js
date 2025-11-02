/**
 * Tree Structure Normalizer
 * Normalizes any tree format into canonical format:
 * - Branch: ├── and └──
 * - Continuation: │   (3 spaces)
 * - Indentation: 3 spaces per level
 */
const TREE_PATTERNS = {
    BRANCH: /[├┣┠┝┞┟┡┢┤┥┦┧┨┩╟╠╞][\s─━┄┅┈┉╌╍═]*\s*/,
    LAST_BRANCH: /[└┗┖┕┺┻┸┹╚╘][\s─━┄┅┈┉╌╍═]*\s*/,
    CONTINUATION: /[│┃┆┇┊┋║╎╏┋]/,
    LEGACY_BRANCH: /^(\s*)(?:--|\-|└─|└──|├─|├──)\s*/,
};

const CANONICAL = {
    BRANCH: '├── ',
    LAST_BRANCH: '└── ',
    CONTINUATION: '│   ',
    INDENT_SIZE: 3,
};
export function isTreeLine(line) {
    if (!line || !line.trim()) return false;
    return (
        TREE_PATTERNS.BRANCH.test(line) ||
        TREE_PATTERNS.LAST_BRANCH.test(line) ||
        TREE_PATTERNS.CONTINUATION.test(line) ||
        TREE_PATTERNS.LEGACY_BRANCH.test(line)
    );
}
function analyzeTreeLine(line) {
    if (!line || !line.trim()) return null;

    const normalized = line.replace(/\t/g, '    ');
    const standardMatch = normalized.match(/^((?:[│┃┆┇┊┋║╎╏]|\s)*?)((?:[├┣┠┝┞┟┡┢└┗┖┕┺┻┸┹╚╘])(?:[─━┄┅┈┉╌╍═]*)\s*)\s*(.+)$/);

    if (standardMatch) {
        const [, prefix, branchChar, name] = standardMatch;
        const isLast = /[└┗┖┕┺┻┸┹╚╘]/.test(branchChar);
        let depth = 0;
        let i = 0;

        while (i < prefix.length) {
            if (TREE_PATTERNS.CONTINUATION.test(prefix[i])) {
                depth++;
                i++;
                let spacesAfterCont = 0;
                while (i < prefix.length && prefix[i] === ' ') {
                    spacesAfterCont++;
                    i++;
                }
                if (spacesAfterCont > 3) {
                    depth += Math.floor((spacesAfterCont - 2) / 3);
                }
            } else if (prefix[i] === ' ') {
                let spaces = 0;
                while (i < prefix.length && prefix[i] === ' ') {
                    spaces++;
                    i++;
                }
                if (spaces >= 3) {
                    depth += Math.ceil(spaces / 3);
                }
            } else {
                i++;
            }
        }

        depth = depth + 1;
        return { depth, name: name.trim(), isLast, prefix };
    }

    const legacyMatch = normalized.match(/^(\s*)(?:--|\-)\s*(.+)$/);
    if (legacyMatch) {
        const [, spaces, name] = legacyMatch;
        let depth = Math.floor(spaces.length / CANONICAL.INDENT_SIZE) + 1;
        return { depth, name: name.trim(), isLast: false, prefix: spaces };
    }

    const rootMatch = normalized.match(/^([^\s│├└┣┗─\-].+)$/);
    if (rootMatch) {
        return { depth: 0, name: rootMatch[1].trim(), isLast: false, prefix: '' };
    }

    return null;
}

function buildCanonicalLine(depth, name, isLast) {
    if (depth === 0) return name;
    let prefix = '';
    for (let i = 0; i < depth - 1; i++) {
        prefix += CANONICAL.CONTINUATION;
    }
    prefix += isLast ? CANONICAL.LAST_BRANCH : CANONICAL.BRANCH;
    return prefix + name;
}

function isLastAtDepth(parsedLines, currentIndex) {
    const currentDepth = parsedLines[currentIndex].depth;
    for (let i = currentIndex + 1; i < parsedLines.length; i++) {
        const nextDepth = parsedLines[i].depth;
        if (nextDepth === currentDepth) return false;
        if (nextDepth < currentDepth) return true;
    }
    return true;
}
export function normalizeTree(input) {
    if (!input || typeof input !== 'string') return input;

    const lines = input.split(/\r?\n/);
    const parsedLines = [];
    let hasRootLine = false;

    for (const line of lines) {
        if (!line.trim()) continue;
        const analyzed = analyzeTreeLine(line);
        if (analyzed) {
            if (analyzed.depth === 0 && !isTreeLine(line)) hasRootLine = true;
            parsedLines.push(analyzed);
        }
    }

    if (parsedLines.length === 0) return input;

    const allAtRoot = parsedLines.every(p => p.depth === 0);
    if (allAtRoot && !hasTreeStructure(input)) return input;

    for (let i = 0; i < parsedLines.length; i++) {
        parsedLines[i].isLast = isLastAtDepth(parsedLines, i);
    }

    const normalizedLines = parsedLines.map(({ depth, name, isLast }) =>
        buildCanonicalLine(depth, name, isLast)
    );

    return normalizedLines.join('\n');
}

export function normalizeTreeLines(lines) {
    if (!Array.isArray(lines)) return lines;
    const input = lines.join('\n');
    const normalized = normalizeTree(input);
    return normalized.split(/\r?\n/);
}

export function hasTreeStructure(input) {
    if (!input || typeof input !== 'string') return false;
    const lines = input.split(/\r?\n/);
    return lines.some(line => isTreeLine(line));
}
export function isCanonicalFormat(input) {
    if (!input || typeof input !== 'string') return false;
    const lines = input.split(/\r?\n/).filter(l => l.trim());

    for (const line of lines) {
        if (!line.trim()) continue;
        const hasNonCanonical = /[┣┠┝┞┟┡┢┤┥┦┧┨┩╟╠╞┃┆┇┊┋║╎╏┗┖┕┺┻┸┹╚╘━┄┅┈┉╌╍═]/.test(line) || /(?:--|\s-\s)/.test(line);
        if (hasNonCanonical) return false;

        if (isTreeLine(line)) {
            const match = line.match(/^((?:[│]\s{3})*)(├──|└──)\s/);
            if ((line.includes('├') || line.includes('└')) && !match) return false;
        }
    }
    return true;
}

export default {
    normalizeTree,
    normalizeTreeLines,
    hasTreeStructure,
    isCanonicalFormat,
    isTreeLine,
    CANONICAL,
};
