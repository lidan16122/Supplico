using SupplicoWebAPI.DTO;

namespace SupplicoWebAPI.Utils
{
    public class FilesManager
    {
        public string Path { get; private set; }

        public FilesManager(string path)
        {
            Path = path;
        }

        public void SaveFile(IFormFile file)
        {
            var fullPath = Path + "\\" + file.FileName;
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
        }

        public void DeleteFile(string fileName)
        {
            var fullPath = Path + "\\" + fileName;
            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);
            else
                throw new Exception("File not found.");
        }

        public HttpFile GetHttpFile(string fileName)
        {
            var fullPath = Path + "\\" + fileName;
            if (System.IO.File.Exists(fullPath))
            {
                var fileContent = System.IO.File.ReadAllBytes(fullPath);
                return new HttpFile(fileContent, fileName);
            }
            else
            {
                throw new Exception("File not found.");
            }
        }

        public bool Exists(string fileName)
        {
            return (System.IO.File.Exists(Path + "\\" + fileName));
        }

        public string GetImageString(string fileName, byte[] fileBytes)
        {
            string mimeType = MimeMapping.MimeUtility.GetMimeMapping(fileName);            //Convert byte array to base64string
            string fileData_Base64 = Convert.ToBase64String(fileBytes);
            return $"data:{mimeType};base64,{fileData_Base64}";
        }
    }
}
