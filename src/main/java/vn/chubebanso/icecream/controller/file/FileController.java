package vn.chubebanso.icecream.controller.file;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vn.chubebanso.icecream.domain.ResUploadFileDTO;
import vn.chubebanso.icecream.service.FileService;
import vn.chubebanso.icecream.util.error.StorageException;

@RestController
public class FileController {
    private final FileService fileService;
    @Value("${hoidanit.upload-file.base-uri}")
    private String baseURI;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files")
    public ResponseEntity<ResUploadFileDTO> upload(@RequestParam("file") MultipartFile file,
            @RequestParam("folder") String folder) throws URISyntaxException, IOException, StorageException {
        if (file == null || file.isEmpty()) {
            throw new StorageException("File không được rỗng");
        }
        String fileName = file.getOriginalFilename();
        List<String> alowwExtension = Arrays.asList("doc", "pdf", "png", "jpeg", "jpg");
        boolean isValid = alowwExtension.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));
        if (!isValid) {
            throw new StorageException("File chỉ được chứa định dạng doc,pdf,png,jpeg,jpg");
        }
        this.fileService.createDirectory(baseURI + folder);
        String uploadFile = this.fileService.store(file, folder);
        ResUploadFileDTO res = new ResUploadFileDTO(uploadFile, Instant.now());
        return ResponseEntity.ok().body(res);
    }

}
