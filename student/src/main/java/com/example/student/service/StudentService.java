package com.example.student.service;

import com.example.student.exception.StudentNotFoundException;
import com.example.student.model.Student;
import com.example.student.repository.StudentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    // Save new student
    public Student saveStudent(Student student) {
        return repository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    // Update student
    public Student updateStudent(Long id, Student student) {
        Student existing = repository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        existing.setName(student.getName());
        existing.setEmail(student.getEmail());
        existing.setCourse(student.getCourse());

        return repository.save(existing);
    }

    // Delete student
    public void deleteStudent(Long id) {
        if (!repository.existsById(id)) {
            throw new StudentNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
