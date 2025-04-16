namespace DATLICHKHAM.Domain
{
    public class RequestUploadFile
    {
        public IFormFile? file { get; set; }
        public string? data { get; set; }
    }

    public class RequestUploadMultiFile
    {
        public List<IFormFile>? files { get; set; }
        public string? data { get; set; }
    }
}
