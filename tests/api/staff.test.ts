import { test, expect } from '@jest/globals';
import { getStaff, getStaffById, createStaff, updateStaff, deleteStaff } from '../../src/utils/staff';

describe('Staff API', () => {
  let testStaffId: string;

  const testStaff = {
    name: 'Test Staff',
    role: 'Coach',
    image: 'https://example.com/staff.jpg'
  };

  test('should create staff', async () => {
    const staff = await createStaff(testStaff);
    testStaffId = staff.id;
    
    expect(staff).toHaveProperty('id');
    expect(staff.name).toBe(testStaff.name);
    expect(staff.role).toBe(testStaff.role);
  });

  test('should get all staff', async () => {
    const staffList = await getStaff();
    expect(Array.isArray(staffList)).toBe(true);
    expect(staffList.length).toBeGreaterThan(0);
  });

  test('should get staff by id', async () => {
    const staff = await getStaffById(testStaffId);
    expect(staff).not.toBeNull();
    expect(staff.id).toBe(testStaffId);
  });

  test('should update staff', async () => {
    const updatedStaff = await updateStaff(testStaffId, {
      name: 'Updated Name'
    });
    expect(updatedStaff).not.toBeNull();
    expect(updatedStaff.name).toBe('Updated Name');
  });

  test('should delete staff', async () => {
    const result = await deleteStaff(testStaffId);
    expect(result).toBe(true);

    const deletedStaff = await getStaffById(testStaffId);
    expect(deletedStaff).toBeNull();
  });
});