import Link from "next/link";

export const metadata = {
        title: "Privacy Policy | Industrial Print Solutions",
        description:
                "Understand how Industrial Print Solutions collects, uses, and protects personal data across its platforms and services.",
};

const sectionHeadingClass = "text-2xl font-semibold text-gray-900";
const paragraphClass = "text-base leading-relaxed text-gray-700";
const listClass = "list-disc space-y-2 pl-6 text-gray-700";

export default function PrivacyPolicyPage() {
        return (
                <div className="bg-gray-50 py-12 text-gray-900">
                        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
                                <header className="space-y-2 text-center">
                                        <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
                                        <p className="text-sm font-medium text-gray-500">Effective date: 01 September 2025</p>
                                </header>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>1) Who we are &amp; scope</h2>
                                        <p className={paragraphClass}>
                                                This Privacy Policy explains how Industrial Print Solutions (&ldquo;IPS&rdquo;, &ldquo;we&rdquo;,
                                                &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses, shares, and protects personal data when you visit
                                                or purchase from our websites and related pages, place orders, upload
                                                logos/artwork for customization, or communicate with us (collectively, the
                                                &ldquo;Platform&rdquo; and &ldquo;Services&rdquo;). By using our Platform, you consent to this
                                                Policy and our Terms. We may update this Policy; the &ldquo;Effective date&rdquo; above
                                                shows the latest version.
                                        </p>
                                        <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-900">
                                                <p className="font-semibold text-amber-900">Important for IPS clients:</p>
                                                <p>
                                                        We use your logo/artwork only to create, preview, personalize, print, and
                                                        (where applicable) host your QR training pages for your order(s). We do not
                                                        use your logo for any other client or our marketing unless you give explicit
                                                        written consent.
                                                </p>
                                        </div>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>2) What we collect</h2>
                                        <p className={paragraphClass}>
                                                We collect data in three ways: (A) you provide it, (B) it&rsquo;s collected automatically,
                                                and (C) it comes from service partners needed to fulfil your order.
                                        </p>
                                        <div className="space-y-3">
                                                <h3 className="text-lg font-semibold text-gray-900">A. Data you provide</h3>
                                                <ul className={listClass}>
                                                        <li>
                                                                <span className="font-medium text-gray-900">Account &amp; contact:</span>
                                                                &nbsp;name, company, email, phone, billing and shipping addresses.
                                                        </li>
                                                        <li>
                                                                <span className="font-medium text-gray-900">Order &amp; approvals:</span>
                                                                &nbsp;product selections, size/material, proofs/approvals, instructions.
                                                        </li>
                                                        <li>
                                                                <span className="font-medium text-gray-900">Logos &amp; artwork:</span>
                                                                &nbsp;files and brand assets you upload or email to us for customization.
                                                        </li>
                                                        <li>
                                                                <span className="font-medium text-gray-900">Communications:</span>
                                                                &nbsp;emails/WhatsApp/support messages, feedback, survey responses.
                                                        </li>
                                                </ul>
                                        </div>
                                        <div className="space-y-3">
                                                <h3 className="text-lg font-semibold text-gray-900">B. Data collected automatically</h3>
                                                <p className={paragraphClass}>
                                                        Device, browser, pages viewed, IP address, timestamps, and general location;
                                                        cookies and similar technologies for essential site functions, analytics,
                                                        and (if you opt in) marketing performance.
                                                </p>
                                        </div>
                                        <div className="space-y-3">
                                                <h3 className="text-lg font-semibold text-gray-900">C. Data from service partners (purpose-limited)</h3>
                                                <ul className={listClass}>
                                                        <li>
                                                                <span className="font-medium text-gray-900">Payment gateway (e.g., Razorpay or bank/aggregator):</span>
                                                                &nbsp;payment status, method token, and fraud signals; we do not collect
                                                                or store full card details.
                                                        </li>
                                                        <li>
                                                                <span className="font-medium text-gray-900">Logistics &amp; couriers:</span>
                                                                &nbsp;tracking updates and delivery confirmations.
                                                        </li>
                                                        <li>
                                                                <span className="font-medium text-gray-900">Cloud/storage, email and messaging providers</span>
                                                                &nbsp;used to operate the service.
                                                        </li>
                                                </ul>
                                                <p className="text-sm leading-relaxed text-gray-600">
                                                        (When a third-party collects your data directly, their policy applies; please
                                                        review it on their site.)
                                                </p>
                                        </div>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>
                                                3) Why we use your data (lawful basis under India&rsquo;s DPDP Act, 2023)
                                        </h2>
                                        <p className={paragraphClass}>
                                                We process personal data with your consent or as reasonably necessary to provide the
                                                Services you request, including to:
                                        </p>
                                        <ul className={listClass}>
                                                <li>Create previews, personalize/print signs and posters, and operate QR content pages.</li>
                                                <li>Fulfil and deliver orders, provide support, handle complaints and warranty claims.</li>
                                                <li>Send essential service notifications and (optionally) marketing communications (opt-out anytime).</li>
                                                <li>Improve the Platform, detect/prevent fraud or misuse, and comply with law.</li>
                                        </ul>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>4) Special rule for logos &amp; artwork you supply</h2>
                                        <ul className={listClass}>
                                                <li>
                                                        <span className="font-medium text-gray-900">Ownership:</span> You (or your licensors)
                                                        retain IP rights in your logo/artwork.
                                                </li>
                                                <li>
                                                        <span className="font-medium text-gray-900">Limited license to IPS:</span> You grant IPS a
                                                        revocable, limited, purpose-bound license to use your logo/artwork only to design,
                                                        preview, print, pack, deliver, and (if applicable) host QR content for your orders/subscriptions.
                                                </li>
                                                <li>
                                                        <span className="font-medium text-gray-900">No cross-use:</span> We will not reuse your logo for
                                                        other customers, portfolios, ads, sample listings, or social media without your explicit written consent.
                                                </li>
                                                <li>
                                                        <span className="font-medium text-gray-900">Deletion on request:</span> You can ask us to delete stored
                                                        logo files once orders are closed (subject to lawful retention needs).
                                                </li>
                                        </ul>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>5) Cookies &amp; similar technologies</h2>
                                        <p className={paragraphClass}>
                                                We use essential cookies for login, cart and checkout; analytics cookies to understand site usage; and
                                                optional marketing pixels. You can manage cookies in your browser; blocking some cookies may impair site features.
                                        </p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>6) Sharing &amp; disclosures (purpose-limited)</h2>
                                        <p className={paragraphClass}>We may share data with:</p>
                                        <ul className={listClass}>
                                                <li>Payment service providers (for processing and fraud control); we don&rsquo;t store full card data.</li>
                                                <li>Printing/finishing partners (for production), couriers (for delivery).</li>
                                                <li>Cloud, email, messaging and customer-support tools we use to run IPS.</li>
                                                <li>Affiliates/partners only to the extent needed to provide services you request.</li>
                                                <li>Law enforcement or regulators where required by applicable law or legal process; to enforce our terms; or to protect the rights, property, or safety of users or the public.</li>
                                        </ul>
                                        <p className={paragraphClass}>We do not sell personal data.</p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>7) International transfers</h2>
                                        <p className={paragraphClass}>
                                                Your data may be processed on servers or by vendors located in or outside India. Transfers will comply with Indian
                                                law (DPDP Act, 2023), including any government-notified restrictions on specific jurisdictions.
                                        </p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>8) Retention</h2>
                                        <p className={paragraphClass}>
                                                We keep personal data only as long as necessary for the purposes above or as required by tax, accounting and other
                                                laws (e.g., Companies Act/GST laws). Design files (including logos) may be kept to support reprints or active subscriptions;
                                                you can request deletion once obligations close.
                                        </p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>9) Security</h2>
                                        <p className={paragraphClass}>
                                                We implement reasonable security practices and procedures to protect data against unauthorized access, alteration or loss.
                                                However, internet transmission has inherent risks; please safeguard your account credentials.
                                        </p>
                                        <p className={paragraphClass}>
                                                If we become aware of a data incident that materially affects you, we will take steps consistent with law and good
                                                industry practice to investigate, mitigate, and notify where required.
                                        </p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>10) Your choices &amp; rights (DPDP Act, 2023)</h2>
                                        <p className={paragraphClass}>Subject to applicable law, you can:</p>
                                        <ul className={listClass}>
                                                <li>Access a summary of your personal data and processing activities.</li>
                                                <li>Correct/update inaccurate or incomplete personal data.</li>
                                                <li>Erase personal data that is no longer necessary for stated purposes or legal compliance.</li>
                                                <li>Withdraw consent (this won&rsquo;t affect prior processing; some services may stop).</li>
                                                <li>Grievance redressal via our Grievance Officer (details below).</li>
                                                <li>Nominate an individual to exercise your rights in the event of incapacity or death.</li>
                                        </ul>
                                        <p className="text-sm italic text-gray-600">
                                                Legal references: DPDP Act sections on access/correction/erasure, consent, grievance redressal and nomination.
                                        </p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>11) Marketing communications</h2>
                                        <p className={paragraphClass}>
                                                We may send you service and order emails by default. We only send marketing emails/WhatsApp with consent and provide an
                                                opt-out in each message or via email to us.
                                        </p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>12) Children&rsquo;s data</h2>
                                        <p className={paragraphClass}>
                                                Our Platform is intended for business users and adults. We do not knowingly collect personal data from children under 18.
                                        </p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>13) Third-party links</h2>
                                        <p className={paragraphClass}>
                                                Our site may contain links to third-party websites or payment pages. Their privacy practices apply when you use them;
                                                please review their policies.
                                        </p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>14) Grievance redressal</h2>
                                        <p className={paragraphClass}>
                                                We have a grievance mechanism consistent with Indian rules. We aim to acknowledge within 48 hours and resolve within 30 days of
                                                receipt (or any shorter legal timeframe if prescribed). Contact:
                                        </p>
                                        <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-700">
                                                <p className="font-semibold text-gray-900">Grievance Officer &ndash; Mr. Shubham</p>
                                                <p>
                                                        Email: <Link href="mailto:info@industrialprintsolutions.com" className="text-amber-600 underline">info@industrialprintsolutions.com</Link>
                                                </p>
                                                <p>
                                                        Mobile: <Link href="tel:+919936814137" className="text-amber-600 underline">+91 9936814137</Link>
                                                </p>
                                                <p>Address: 127/196, U-Block, Niralanagar, Kanpur, 208014</p>
                                        </div>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>15) Exercising your rights / withdrawing consent / deleting logo files</h2>
                                        <p className={paragraphClass}>
                                                Email <Link href="mailto:info@industrialprintsolutions.com" className="text-amber-600 underline">info@industrialprintsolutions.com</Link> with the subject
                                                line &ldquo;Privacy Request &ndash; [Access/Correction/Erasure/Withdraw Consent/Logo Deletion/Nomination]&rdquo;. We may verify your identity (and authority,
                                                where acting on behalf of a company) before acting.
                                        </p>
                                </section>

                                <section className="space-y-4">
                                        <h2 className={sectionHeadingClass}>16) Where to find changes to this Policy</h2>
                                        <p className={paragraphClass}>
                                                We&rsquo;ll post updates on this page and adjust the &ldquo;Effective date.&rdquo; For significant changes required by law, we&rsquo;ll also notify you through
                                                the Platform or email.
                                        </p>
                                </section>
                        </div>
                </div>
        );
}
