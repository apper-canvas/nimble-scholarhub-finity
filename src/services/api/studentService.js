import { toast } from 'react-toastify';

const tableName = 'student_c';

export const studentService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "grade_level_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "class_ids_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to UI format
      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        gradeLevel: student.grade_level_c || 0,
        email: student.email_c || '',
        enrollmentDate: student.enrollment_date_c || new Date().toISOString(),
        status: student.status_c || 'Active',
        classIds: student.class_ids_c ? student.class_ids_c.split(',') : []
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "grade_level_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "class_ids_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const student = response.data;
      return {
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        gradeLevel: student.grade_level_c || 0,
        email: student.email_c || '',
        enrollmentDate: student.enrollment_date_c || new Date().toISOString(),
        status: student.status_c || 'Active',
        classIds: student.class_ids_c ? student.class_ids_c.split(',') : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          grade_level_c: parseInt(studentData.gradeLevel),
          email_c: studentData.email,
          enrollment_date_c: studentData.enrollmentDate || new Date().toISOString(),
          status_c: studentData.status || 'Active',
          class_ids_c: studentData.classIds ? studentData.classIds.join(',') : ''
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create student ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdStudent = successfulRecords[0].data;
          return {
            Id: createdStudent.Id,
            firstName: createdStudent.first_name_c || '',
            lastName: createdStudent.last_name_c || '',
            gradeLevel: createdStudent.grade_level_c || 0,
            email: createdStudent.email_c || '',
            enrollmentDate: createdStudent.enrollment_date_c || new Date().toISOString(),
            status: createdStudent.status_c || 'Active',
            classIds: createdStudent.class_ids_c ? createdStudent.class_ids_c.split(',') : []
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return null;
  },

  async update(id, studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          grade_level_c: parseInt(studentData.gradeLevel),
          email_c: studentData.email,
          enrollment_date_c: studentData.enrollmentDate,
          status_c: studentData.status,
          class_ids_c: studentData.classIds ? studentData.classIds.join(',') : ''
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update student ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedStudent = successfulUpdates[0].data;
          return {
            Id: updatedStudent.Id,
            firstName: updatedStudent.first_name_c || '',
            lastName: updatedStudent.last_name_c || '',
            gradeLevel: updatedStudent.grade_level_c || 0,
            email: updatedStudent.email_c || '',
            enrollmentDate: updatedStudent.enrollment_date_c || new Date().toISOString(),
            status: updatedStudent.status_c || 'Active',
            classIds: updatedStudent.class_ids_c ? updatedStudent.class_ids_c.split(',') : []
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return null;
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete student ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return false;
  }
};