const toTrimmedString = (value) => {
        if (typeof value === "string") {
                const trimmed = value.trim();
                return trimmed.length ? trimmed : null;
        }

        if (typeof value === "number") {
                return String(value);
        }

        return null;
};

const coerceBoolean = (value) => {
        if (typeof value === "boolean") {
                return value;
        }

        if (typeof value === "number") {
                if (value === 1) return true;
                if (value === 0) return false;
        }

        if (typeof value === "string") {
                const normalized = value.trim().toLowerCase();

                if (!normalized) return null;

                if (["true", "yes", "y", "1", "with qr", "with"].includes(normalized)) {
                        return true;
                }

                if (["false", "no", "n", "0", "without qr", "without"].includes(normalized)) {
                        return false;
                }
        }

        return null;
};

const pickValue = (sources, keys, parser = toTrimmedString) => {
        for (const source of sources) {
                if (!source || typeof source !== "object") continue;

                for (const key of keys) {
                        if (!(key in source)) continue;

                        const rawValue = source[key];
                        if (rawValue === undefined || rawValue === null) continue;

                        const parsedValue = parser(rawValue);
                        if (parsedValue !== null && parsedValue !== undefined && parsedValue !== "") {
                                return parsedValue;
                        }
                }
        }

        return null;
};

export const extractOrderItemOptions = (item = {}) => {
        const sources = [item, item?.selectedOptions];

        const options = {
                language: pickValue(sources, [
                        "language",
                        "selectedLanguage",
                        "languageOption",
                        "languageSelection",
                        "productLanguage",
                ]),
                size: pickValue(sources, [
                        "size",
                        "selectedSize",
                        "sizeOption",
                        "sizeSelection",
                        "dimension",
                ]),
                material: pickValue(sources, [
                        "material",
                        "selectedMaterial",
                        "materialOption",
                        "materialSelection",
                ]),
                layout: pickValue(sources, [
                        "layout",
                        "selectedLayout",
                        "layoutOption",
                        "layoutSelection",
                ]),
        };

        const qrBoolean = pickValue(sources, ["qr", "hasQr", "withQr", "qrEnabled"], coerceBoolean);
        const qrLabel = pickValue(sources, ["qrOption", "qrLabel", "qrSelection", "qrText"]);

        if (qrBoolean !== null) {
                options.hasQr = qrBoolean;
                options.qrOption = qrBoolean ? "With QR" : "Without QR";
        } else if (qrLabel) {
                options.qrOption = qrLabel;
        }

        return options;
};

export const getOrderItemOptionEntries = (item) => {
        const options = extractOrderItemOptions(item);

        return [
                { label: "Language", value: options.language },
                { label: "Size", value: options.size },
                { label: "Material", value: options.material },
                { label: "Layout", value: options.layout },
                { label: "QR", value: options.qrOption },
        ].filter((entry) => Boolean(entry.value));
};
