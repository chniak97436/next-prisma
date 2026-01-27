import { NextResponse } from 'next/server';

export function success(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message) {
  return NextResponse.json({ message }, { status: 400 });
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401 });
}

export function notFound(message = 'Not Found') {
  return NextResponse.json({ message }, { status: 404 });
}

export function conflict(message) {
  return NextResponse.json({ message }, { status: 409 });
}

export function internalServerError(message = 'Internal Server Error') {
  return NextResponse.json({ message }, { status: 500 });
}
