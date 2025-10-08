export function GET() {
        return Response.json(
                { message: "Product reviews are no longer available." },
                { status: 410 }
        );
}

export function POST() {
        return Response.json(
                { message: "Submitting product reviews is no longer supported." },
                { status: 410 }
        );
}
