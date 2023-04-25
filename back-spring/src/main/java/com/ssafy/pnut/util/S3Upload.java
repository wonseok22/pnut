//package com.ssafy.pnut.util;
//
//import com.amazonaws.AmazonServiceException;
//import com.amazonaws.services.s3.AmazonS3Client;
//import com.amazonaws.services.s3.model.CannedAccessControlList;
//import com.amazonaws.services.s3.model.DeleteObjectRequest;
//import com.amazonaws.services.s3.model.PutObjectRequest;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.util.Optional;
//import java.util.UUID;
//
//@Component
//@RequiredArgsConstructor
//public class S3Upload {
//    private final AmazonS3Client amazonS3Client;
//
//    @Value("${cloud.aws.s3.bucket}")
//    private String bucket;
//
//    public String uploadFiles(MultipartFile multipartFile, String dirName) throws IOException{
//        File uploadFile = convert(multipartFile)
//                .orElseThrow(()->new IllegalArgumentException("error: MultipartFile->File convert fail"));
//        return upload(uploadFile, dirName);
//    }
//
//    public String upload(File uploadFile, String filePath){
//        String fileName = filePath + "/" + UUID.randomUUID(); //filename save to S3
//        System.out.println("file name = "+fileName);
//        String uploadImageUrl = putS3(uploadFile, fileName);
//        removeNewFile(uploadFile);
//        return uploadImageUrl;
//    }
//
//    //upload to S3
//    private String putS3(File uploadFile, String fileName){
//        amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, uploadFile).withCannedAcl(CannedAccessControlList.PublicRead));
//        return amazonS3Client.getUrl(bucket, fileName).toString();
//    }
//    //delete stored image in local drive
//    private void removeNewFile(File targetFile){
//        if(targetFile.delete()){
//            System.out.println("File delete success");
//            return;
//        }
//        System.out.println("File delete fail");
//    }
//    //upload file in local drive
//    private Optional<File> convert(MultipartFile file) throws IOException{
//        File convertFile = new File(file.getOriginalFilename());
//        if(convertFile.createNewFile()){
//            try(FileOutputStream fos = new FileOutputStream(convertFile)){
//                fos.write(file.getBytes());
//            }
//            return Optional.of(convertFile);
//        }
//        return Optional.empty();
//    }
//    //delete file
//    public void fileDelete(String fileURL) throws Exception{
//        try{
//            try{
//                amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, fileURL));
//            } catch (AmazonServiceException e){
//                System.err.println(e.getErrorMessage());
//                System.exit(1);
//            }
//            System.out.println(String.format("[%s] deletion complete", fileURL));
//        } catch(Exception e){
//            throw e;
//        }
//    }
//}
