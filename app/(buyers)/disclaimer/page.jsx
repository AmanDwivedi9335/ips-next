export const metadata = {
        title: "Disclaimer | Industrial Print Solutions",
        description:
                "Read the Industrial Print Solutions disclaimer covering liability, third-party services, and other important terms.",
};

const sections = [
        {
                title: "Information only—no professional advice",
                content: [
                        "Content on our website, posters, QR pages, videos, emails, and materials is for general awareness. It does not constitute legal, regulatory, engineering, safety, or compliance advice. You are responsible for meeting all applicable laws, standards, and training requirements at your workplace.",
                ],
        },
        {
                title: "Safety posters are supplementary",
                content: [
                        "Our posters/signage/QR content support good practices but do not replace statutory training, audits, permits, certifications, or employer obligations.",
                ],
        },
        {
                title: "Logos & artwork provided by you",
                content: [
                        "You (or your licensors) own your logo/artwork. You authorize IPS to use it only to design/preview/print/deliver your ordered items (and related QR pages). We do not reuse your logo for other clients or marketing without explicit written consent. You warrant you have rights to the assets you submit.",
                ],
        },
        {
                title: "Product visuals & color tolerance",
                content: [
                        "Images/mockups are illustrative. Final colors/finishes may vary within standard print tolerances due to screens, substrates, inks, lighting, and batch variation.",
                ],
        },
        {
                title: "Third-party links & services",
                content: [
                        "Payment gateways, courier tracking, embedded/linked videos, cloud previews, or other third-party tools are governed by their terms/policies. IPS doesn’t control or guarantee third-party content, uptime, security, or performance.",
                ],
        },
        {
                title: "Availability & updates",
                content: [
                        "We aim for accurate, current information but may update/correct content, pricing, specifications, or policies without notice. Site or service availability can be interrupted for maintenance, outages, or events beyond our control.",
                ],
        },
        {
                title: "Limitation of liability (summary)",
                content: [
                        "To the maximum extent permitted by law, IPS is not liable for indirect, incidental, special, or consequential losses (including lost profits/data). In any case, IPS’s total liability is limited to the amount you paid for the relevant order. See Terms & Conditions for full clauses.",
                ],
        },
        {
                title: "Force majeure",
                content: [
                        "We are not responsible for delays/failures due to events beyond reasonable control (e.g., natural disasters, strikes, network outages, regulations).",
                ],
        },
        {
                title: "Governing terms",
                content: [
                        "This Disclaimer is read with our Terms & Conditions, Privacy Policy, Cancellation & Refund, and Shipping & Delivery. If there’s any inconsistency, those documents (and applicable law) prevail.",
                ],
        },
        {
                title: "Contact",
                content: [
                        "Questions or concerns? Email info@industrialprintsolutions.com with the subject “Disclaimer – Query”.",
                ],
        },
];

export default function DisclaimerPage() {
        return (
                <div className="bg-neutral-50 text-neutral-900">
                        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12 md:px-8 md:py-16">
                                <header className="space-y-3">
                                        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                                                Disclaimer
                                        </h1>
                                        <p className="text-sm text-neutral-600">Effective date: 01 September 2025</p>
                                        <p className="text-sm text-neutral-600">
                                                Grievance contact:
                                                <a
                                                        href="mailto:info@industrialprintsolutions.com"
                                                        className="ml-1 font-medium text-amber-600 hover:text-amber-700"
                                                >
                                                        info@industrialprintsolutions.com
                                                </a>
                                        </p>
                                </header>

                                <div className="space-y-10">
                                        {sections.map((section) => (
                                                <section key={section.title} className="space-y-3">
                                                        <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">
                                                                {section.title}
                                                        </h2>
                                                        {section.content.map((paragraph, index) => (
                                                                <p
                                                                        key={`${section.title}-paragraph-${index}`}
                                                                        className="text-base leading-relaxed text-neutral-700 md:text-lg"
                                                                >
                                                                        {paragraph}
                                                                </p>
                                                        ))}
                                                </section>
                                        ))}
                                </div>

                                <footer className="rounded-lg border border-neutral-200 bg-white/80 p-6 text-sm leading-relaxed text-neutral-700 shadow-sm">
                                        <p>
                                                Need to escalate a grievance? Reach out at
                                                <a
                                                        href="mailto:info@industrialprintsolutions.com?subject=Disclaimer%20%E2%80%93%20Query"
                                                        className="ml-1 font-medium text-amber-600 hover:text-amber-700"
                                                >
                                                        info@industrialprintsolutions.com
                                                </a>
                                                with the subject line <span className="ml-1 font-medium">“Disclaimer – Query”</span>.
                                        </p>
                                </footer>
                        </div>
                </div>
        );
}
