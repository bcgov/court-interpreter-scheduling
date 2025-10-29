# Migration Deployment Guide: qr_signed_note Field

## ✅ Local Development (Docker) - COMPLETED

**Migration:** `3050d774eb6e_add_qr_signed_note_to_booking_table.py`

**Status:** ✅ Applied successfully

**Verification:**

```sql
-- Run in local database
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'booking' AND column_name = 'qr_signed_note';
```

Result: `qr_signed_note | character varying`

---

## 📋 Deployment Steps for Dev/Test/Prod Environments

### Prerequisites

- The migration file is in: `api/alembic/versions/3050d774eb6e_add_qr_signed_note_to_booking_table.py`
- Code changes are committed to your branch
- Models and schemas are updated

### Files Modified in This Feature

1. ✅ `api/models/booking_model.py` - Added `qr_signed_note` column
2. ✅ `api/api/schemas/booking_schema.py` - Added field to 3 schemas
3. ✅ `api/alembic/versions/3050d774eb6e_add_qr_signed_note_to_booking_table.py` - Migration file

---

## Dev/Test Environment Deployment

### Option A: Automatic Migration (Recommended)

If your dev/test environment runs `alembic upgrade head` on deployment (like your Docker setup):

1. **Merge/Deploy your code** to dev environment
2. **Restart API pods/containers** - migrations run automatically
3. **Verify migration:**
   ```bash
   # In API pod
   alembic current
   # Should show: 3050d774eb6e (head)
   ```

### Option B: Manual Migration

If migrations need to be run manually:

1. **Deploy code** to dev environment
2. **Access API pod/container:**
   ```bash
   oc rsh <api-pod-name>  # OpenShift
   # or
   kubectl exec -it <api-pod-name> -- /bin/bash  # Kubernetes
   ```
3. **Run migration:**
   ```bash
   cd /opt/app-root/src  # or wherever your app is
   alembic upgrade head
   ```
4. **Verify:**
   ```bash
   alembic current
   # Should show: 3050d774eb6e (head)
   ```

### Verification Queries

**Check migration status:**

```sql
SELECT * FROM alembic_version;
-- Should return: 3050d774eb6e
```

**Verify column exists:**

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'booking'
AND column_name = 'qr_signed_note';

-- Expected result:
-- qr_signed_note | character varying | YES
```

**Test with sample data:**

```sql
-- Update a booking with the new field
UPDATE booking
SET qr_signed_note = 'Test note'
WHERE id = 1;

-- Verify it persisted
SELECT id, qr_signed, qr_signdate, qr_signed_note
FROM booking
WHERE id = 1;
```

---

## Production Environment Deployment

### Pre-Deployment Checklist

- [ ] Migration tested in dev environment
- [ ] Migration tested in test environment
- [ ] Code reviewed and approved
- [ ] Database backup completed
- [ ] Maintenance window scheduled (if required)
- [ ] Rollback plan prepared

### Deployment Steps

1. **Backup Database** (Critical!)

   ```bash
   # Backup command (adjust for your environment)
   pg_dump -h <db-host> -U <db-user> -d <db-name> > backup_before_qr_note_$(date +%Y%m%d).sql
   ```

2. **Deploy Code** to production

3. **Run Migration:**

   ```bash
   # Access production API pod
   oc rsh <prod-api-pod-name>

   # Navigate to app directory
   cd /opt/app-root/src

   # Check current version
   alembic current

   # Run migration
   alembic upgrade head

   # Verify new version
   alembic current  # Should show: 3050d774eb6e (head)
   ```

4. **Verify Column:**

   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'booking' AND column_name = 'qr_signed_note';
   ```

5. **Test API Endpoint:**
   - Test updating a booking with `qualifiedReceiverNote`
   - Verify the field persists
   - Check API responses include the field

### Rollback Procedure (If Needed)

```bash
# Access API pod
oc rsh <api-pod-name>

# Rollback migration
alembic downgrade -1

# Verify rollback
alembic current  # Should show: 656b7778ac27
```

**Note:** Rollback will drop the `qr_signed_note` column and any data in it!

---

## Migration File Content

**File:** `3050d774eb6e_add_qr_signed_note_to_booking_table.py`

```python
def upgrade():
    op.add_column('booking', sa.Column('qr_signed_note', sa.String(), nullable=True))

def downgrade():
    op.drop_column('booking', 'qr_signed_note')
```

**What it does:**

- **Upgrade:** Adds `qr_signed_note` column to `booking` table (nullable, varchar)
- **Downgrade:** Removes `qr_signed_note` column from `booking` table

---

## Testing After Deployment

### API Test (Using Postman/curl)

**Update a booking with the new field:**

```bash
PUT /api/booking/{id}/adm
Content-Type: application/json

{
  "qualifiedReceiverNote": "Sample note for testing",
  "qualifiedReceiverSigned": true,
  "qualifiedReceiverSigningDate": "2025-10-28",
  ...other required fields
}
```

**Retrieve and verify:**

```bash
GET /api/booking/{id}/adm

# Response should include:
{
  "qualifiedReceiverNote": "Sample note for testing",
  ...
}
```

### Database Test

```sql
-- Insert test
UPDATE booking
SET qr_signed_note = 'Production test note'
WHERE id = <test_booking_id>;

-- Verify
SELECT id, qr_signed, qr_signdate, qr_signed_note
FROM booking
WHERE id = <test_booking_id>;
```

---

## Troubleshooting

### Issue: Migration shows as applied but column doesn't exist

**Solution:**

```bash
# Check alembic version
SELECT * FROM alembic_version;

# If version is 3050d774eb6e but column missing:
# 1. Rollback
alembic downgrade -1

# 2. Verify migration file has correct SQL (not just 'pass')
cat alembic/versions/3050d774eb6e_add_qr_signed_note_to_booking_table.py

# 3. Re-apply
alembic upgrade head
```

### Issue: "column already exists" error

**Solution:**

```sql
-- Check if column exists
SELECT column_name FROM information_schema.columns
WHERE table_name = 'booking' AND column_name = 'qr_signed_note';

-- If exists, mark migration as applied without running it
UPDATE alembic_version SET version_num = '3050d774eb6e';
```

### Issue: Container has old migration file

**Solution:**

```bash
# Copy updated migration from local to container
docker cp api/alembic/versions/3050d774eb6e_add_qr_signed_note_to_booking_table.py <container>:/opt/app-root/src/alembic/versions/
```

---

## Summary

✅ **Local (Docker):** Migration applied successfully  
📋 **Dev/Test:** Deploy code → migrations run automatically on pod restart  
🚀 **Production:** Deploy code → manually run `alembic upgrade head` → verify

**Field Details:**

- **Database:** `qr_signed_note` (VARCHAR, nullable)
- **API:** `qualifiedReceiverNote` (camelCase alias)
- **Purpose:** Store notes related to qualified receiver signatures
