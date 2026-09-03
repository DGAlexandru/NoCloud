function mergeAndSortCategories(merges, fixes, commits) {
    const allCommits = [
        ...merges.map(merge => merge.commit),
        ...fixes.map(merge => merge.commit),
        ...commits
    ];

    allCommits.forEach(commit => {
        // When OCD kicks in and you mess with the standard.. this is a try to fix it :)	
        // 1. Creating a working copy of the subject for normalization
        let cleanSubject = commit.subject.trim();

        // 2. Fix spacing around common tags
        // & "capitalization normalization" -> easyer for next steps (e.g., "Feat (core):" -> "feat(core):")
        // This targets feat, fix, chore, refactor, docs, style, test, ci - the current standardized ones
        cleanSubject = cleanSubject.replace(
            /^\s*(feat|fix|chore|refactor|docs|style|test|ci)\s*(?:\(\s*([^)]+?)\s*\))?\s*(!)?\s*:\s*/i,
            (match, type, scope, breaking) => {
                const cleanType = type.toLowerCase();
                const cleanScope = scope ? `(${scope.trim()})` : '';
                const cleanBreaking = breaking ? '!' : '';
                return `${cleanType}${cleanScope}${cleanBreaking}: `;
            }
        );

        // 3a. Assign the normalized subject back to the commit so Handlebars helpers can read it
        commit.subject = cleanSubject;
        // 3b. Fix also the the first line of the commit message body while preserving the rest
        const messageLines = (commit.message || commit.subject).split('\n')
        messageLines[0] = cleanSubject // Replaces the "messy" first line with the normalized one
        commit.message = messageLines.join('\n')

        // 4. Fixing this also: Look for the exclamation mark AFTER the optional scope parentheses
        commit.breaking = /^[A-Za-z0-9.]+(?:\(.*\))?!:/.test(commit.subject);
    });

    return allCommits.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
}

module.exports = function (Handlebars) {
    Handlebars.registerHelper('get-all-non-breaking-commits', function (merges, fixes, commits) {
        return mergeAndSortCategories(merges, fixes, commits).filter(c => c.breaking === false);
    });

    Handlebars.registerHelper('get-all-breaking-commits', function (merges, fixes, commits) {
        return mergeAndSortCategories(merges, fixes, commits).filter(c => c.breaking === true);
    });
    
    Handlebars.registerHelper("render-ccm", function(subject) {
        // Match the exclamation mark AFTER the optional scope parentheses
        const match = /^(?<type>[A-Za-z0-9.]+)(?:\((?<scope>[A-Za-z0-9.]+)\))?(?<breaking>!)?: (?<message>.*)$/.exec(subject);
        
        if (typeof match?.groups?.type === "string" && typeof match?.groups?.message === "string") {
            let output = match.groups.message;
            
            if (typeof match.groups.scope === "string") {
                output = `**${match.groups.scope}**: ${output}`;
            }
            
            return output;
        } else {
            return subject;
        }
    });
};
