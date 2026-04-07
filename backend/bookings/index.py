"""
Управление бронированиями ресторана Golden Fork.
GET / — список бронирований (для админки)
POST / — создать новое бронирование (от гостя)
PUT / — изменить статус бронирования (для админки)
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = body.get('name', '').strip()
        phone = body.get('phone', '').strip()
        date = body.get('date', '').strip()
        time = body.get('time', '').strip()
        guests = body.get('guests', '').strip()
        wishes = body.get('wishes', '').strip()

        if not all([name, phone, date, time, guests]):
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Заполните все обязательные поля'})
            }

        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            "INSERT INTO t_p88522653_restaurant_classic_s.bookings (name, phone, date, time, guests, wishes) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, created_at",
            (name, phone, date, time, guests, wishes)
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 201,
            'headers': CORS_HEADERS,
            'body': json.dumps({'id': row['id'], 'message': 'Бронирование создано'})
        }

    if method == 'PUT':
        body = json.loads(event.get('body') or '{}')
        booking_id = body.get('id')
        status = body.get('status')

        if not booking_id or status not in ('pending', 'confirmed', 'cancelled'):
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Неверные параметры'})
            }

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "UPDATE t_p88522653_restaurant_classic_s.bookings SET status = %s WHERE id = %s",
            (status, booking_id)
        )
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'Статус обновлён'})
        }

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute(
        "SELECT id, name, phone, date::text, time, guests, wishes, status, to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at FROM t_p88522653_restaurant_classic_s.bookings ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps(list(rows))
    }
