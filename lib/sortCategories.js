export function sortCategoriesByOrder(list = []) {
        if (!Array.isArray(list)) {
                return [];
        }

        const parseSortOrder = (value) => {
                if (typeof value === "number") {
                        return Number.isFinite(value) ? value : null;
                }

                if (typeof value === "string" && value.trim() !== "") {
                        const parsed = Number.parseFloat(value);
                        return Number.isFinite(parsed) ? parsed : null;
                }

                return null;
        };

        return [...list].sort((a = {}, b = {}) => {
                const aOrder = parseSortOrder(a.sortOrder);
                const bOrder = parseSortOrder(b.sortOrder);

                if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
                        return aOrder - bOrder;
                }

                if (aOrder !== null && bOrder === null) {
                        return -1;
                }

                if (aOrder === null && bOrder !== null) {
                        return 1;
                }

                const aName = typeof a.name === "string" ? a.name : "";
                const bName = typeof b.name === "string" ? b.name : "";

                return aName.localeCompare(bName, undefined, { sensitivity: "base" });
        });
}
